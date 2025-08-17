import { useDialogContext as useDialogCtx } from '../components/Dialog/DialogProvider'

export const useDialogContext = () => {
  const context = useDialogCtx()
  return context.dialog
}