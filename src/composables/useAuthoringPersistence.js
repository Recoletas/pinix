import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const EXIT_GUARD_STATUSES = new Set(['unsaved', 'saving', 'error'])

function valueOf(source) {
  return unref(source)
}

export function useAuthoringPersistence({
  selectedBookId,
  selectedChapterId,
  activeDocument,
  saveStatus = ref('saved'),
  writingRecoveryDraft,
  pendingGhostAdoption,
  blockPreview,
  blockComposer,
  currentChapterTitle,
  canEditTitle,
  syncFromEditor,
  persistChapter,
  persistActiveDocument,
  confirmDurablePersistence,
  writeRecoveryDraft,
  clearRecoveryDraft,
  getActiveRecoveryKey,
  notify,
  getEditorText,
  downloadText,
  formatRecoveryTime,
  openHistory,
  buildOutgoingBoundary,
  dispatchOutgoingBoundary,
  cancelCopilot,
  abandonBlockComposer,
  markExplorationDirty
}) {
  let contentSaveTimer = null
  let titleSaveTimer = null
  let recoveryTimer = null
  let feedbackTimer = null

  const saveFeedbackVisible = ref(false)
  const stampStateText = computed(() => {
    if (saveStatus.value === 'saving') return '保存中'
    if (saveStatus.value === 'unsaved') return '未保存'
    if (saveStatus.value === 'error') return '保存失败'
    return '已保存'
  })
  const saveRescueVisible = computed(() => saveStatus.value === 'error' || Boolean(valueOf(writingRecoveryDraft)))
  const saveRescueText = computed(() => {
    if (saveStatus.value === 'error') return '正文保存失败，你的输入仍保留在稿面。'
    const draft = valueOf(writingRecoveryDraft)
    const time = draft ? formatRecoveryTime?.(draft.createdAt) : ''
    return time ? `发现一份未保存的恢复稿 · ${time}` : '发现一份未保存的恢复稿。'
  })

  function activeDocumentSaveScopeKey() {
    const document = valueOf(activeDocument)
    const role = document ? 'exploration' : 'chapter'
    const documentId = document?.id || valueOf(selectedChapterId) || ''
    return `${valueOf(selectedBookId) || ''}|${role}|${documentId}`
  }

  function cancelContentSave() {
    if (contentSaveTimer) clearTimeout(contentSaveTimer)
    contentSaveTimer = null
  }

  function cancelTitleSave() {
    if (titleSaveTimer) clearTimeout(titleSaveTimer)
    titleSaveTimer = null
  }

  function cancelRecoveryDraftSchedule() {
    if (recoveryTimer) clearTimeout(recoveryTimer)
    recoveryTimer = null
  }

  function clearPendingDocumentSaveTimers() {
    cancelContentSave()
    cancelTitleSave()
  }

  function scheduleWritingRecoveryDraft() {
    cancelRecoveryDraftSchedule()
    const scheduledScopeKey = activeDocumentSaveScopeKey()
    recoveryTimer = setTimeout(() => {
      recoveryTimer = null
      if (activeDocumentSaveScopeKey() !== scheduledScopeKey) return
      writeRecoveryDraft?.()
    }, 250)
  }

  function clearSuccessfulRecoveryDraft() {
    const key = getActiveRecoveryKey?.()
    if (key) clearRecoveryDraft?.(key)
    if (writingRecoveryDraft) writingRecoveryDraft.value = null
  }

  async function confirmPersistence() {
    if (!confirmDurablePersistence) return true
    const result = await confirmDurablePersistence()
    return result === true || result?.ok === true
  }

  async function persistCurrent(options = undefined) {
    const document = valueOf(activeDocument)
    const locallySaved = document
      ? persistActiveDocument?.()?.ok === true
      : (!valueOf(selectedChapterId) || persistChapter?.(options) === true)
    if (!locallySaved) return false
    return confirmPersistence()
  }

  function onTitleChange() {
    if (canEditTitle && !canEditTitle()) return
    saveStatus.value = 'unsaved'
    scheduleWritingRecoveryDraft()
    cancelTitleSave()
    const scheduledScopeKey = activeDocumentSaveScopeKey()
    titleSaveTimer = setTimeout(async () => {
      titleSaveTimer = null
      if (activeDocumentSaveScopeKey() !== scheduledScopeKey) return
      saveStatus.value = 'saving'
      const saved = persistChapter?.() === true && await confirmPersistence()
      saveStatus.value = saved ? 'saved' : 'error'
    }, 500)
  }

  function onContentChange() {
    syncFromEditor?.()
    saveStatus.value = 'unsaved'
    if (valueOf(activeDocument)) markExplorationDirty?.()
    scheduleWritingRecoveryDraft()
    cancelContentSave()
    const scheduledScopeKey = activeDocumentSaveScopeKey()
    if (valueOf(pendingGhostAdoption)) return
    contentSaveTimer = setTimeout(async () => {
      contentSaveTimer = null
      if (activeDocumentSaveScopeKey() !== scheduledScopeKey) return
      saveStatus.value = 'saving'
      const saved = await persistCurrent()
      if (saved) clearSuccessfulRecoveryDraft()
      saveStatus.value = saved ? 'saved' : 'error'
    }, 1000)
  }

  function handleAuthoringPageExit(event) {
    if (!EXIT_GUARD_STATUSES.has(saveStatus.value)) return true
    writeRecoveryDraft?.()
    if (valueOf(pendingGhostAdoption) || valueOf(blockPreview)) {
      if (event?.type === 'beforeunload') {
        event.preventDefault?.()
        event.returnValue = ''
      }
      return false
    }
    clearPendingDocumentSaveTimers()
    const persisted = valueOf(activeDocument)
      ? persistActiveDocument?.()?.ok === true
      : (!valueOf(selectedChapterId) || persistChapter?.({ automaticHistory: false }) === true)
    if (persisted) confirmDurablePersistence?.()
    if (!persisted && event?.type === 'beforeunload') {
      event.preventDefault?.()
      event.returnValue = ''
    }
    return persisted
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') handleAuthoringPageExit({ type: 'visibilitychange' })
  }

  async function retrySaveFromRescue() {
    if (saveStatus.value === 'saving') return
    saveStatus.value = 'saving'
    const saved = await persistCurrent()
    if (saved) clearSuccessfulRecoveryDraft()
    saveStatus.value = saved ? 'saved' : 'error'
  }

  async function exportUnsavedManuscriptFromRescue() {
    if (!valueOf(selectedChapterId)) return
    const liveText = String(getEditorText?.() || '')
    if (!liveText.trim()) {
      notify?.('当前正文是空的，没有可导出的内容')
      return
    }
    const chapterTitle = valueOf(currentChapterTitle) || '未命名章节'
    try {
      const result = await downloadText?.(liveText, `${chapterTitle}-${Date.now()}.md`, 'text/markdown;charset=utf-8')
      if (result?.handled && !result.ok) throw result.error || new Error('导出失败')
      notify?.('已导出当前正文，包含尚未保存的修改')
    } catch (error) {
      notify?.(error?.message || '导出失败，请重试')
    }
  }

  watch(saveStatus, (next, previous) => {
    const needsExitGuard = EXIT_GUARD_STATUSES.has(next)
    if (needsExitGuard) window.addEventListener('beforeunload', handleAuthoringPageExit)
    else window.removeEventListener('beforeunload', handleAuthoringPageExit)
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = null
    if (next === 'saved') {
      saveFeedbackVisible.value = Boolean(previous && previous !== 'saved')
      if (saveFeedbackVisible.value) {
        feedbackTimer = setTimeout(() => {
          saveFeedbackVisible.value = false
          feedbackTimer = null
        }, 1600)
      }
      return
    }
    saveFeedbackVisible.value = true
  })

  onMounted(() => {
    window.addEventListener('pagehide', handleAuthoringPageExit)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleAuthoringPageExit)
    window.removeEventListener('pagehide', handleAuthoringPageExit)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (feedbackTimer) clearTimeout(feedbackTimer)
    clearPendingDocumentSaveTimers()
    cancelRecoveryDraftSchedule()
    if (EXIT_GUARD_STATUSES.has(saveStatus.value)) writeRecoveryDraft?.()
  })

  onBeforeRouteLeave(async () => {
    if (valueOf(pendingGhostAdoption)) {
      notify?.('推演正文尚未保存，请先重试保存或留在当前文档')
      return false
    }
    if (valueOf(blockPreview)) {
      notify?.('推演草稿尚未处理，请先采用或丢弃')
      return false
    }
    const outgoingBoundary = !valueOf(activeDocument) ? buildOutgoingBoundary?.() : null
    if (saveStatus.value !== 'saved') {
      const persisted = await persistCurrent()
      if (!persisted) {
        notify?.('文档保存失败，已留在当前工作台')
        return false
      }
    }
    if (outgoingBoundary) dispatchOutgoingBoundary?.(outgoingBoundary)
    cancelCopilot?.()
    if (valueOf(blockComposer)?.open) abandonBlockComposer?.({ restoreSelection: false })
    return true
  })

  return Object.freeze({
    activeDocumentSaveScopeKey,
    cancelContentSave,
    cancelRecoveryDraftSchedule,
    cancelTitleSave,
    clearPendingDocumentSaveTimers,
    exportUnsavedManuscriptFromRescue,
    onContentChange,
    onTitleChange,
    openRecoveryFromRescue: openHistory,
    retrySaveFromRescue,
    saveFeedbackVisible,
    saveRescueText,
    saveRescueVisible,
    saveStatus,
    stampStateText
  })
}
