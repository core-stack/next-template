type Props = {
  onSuccess?: () => void
  onError?: () => void
}
export const useUpload = ({ onSuccess, onError }: Props = {}) => {
  return (
    file: Blob,
    signedUrl: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.onload = () => {
        if (xhr.status === 200) {
          onSuccess && onSuccess()
          resolve()
        } else {
          onError && onError()
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        onError && onError()
        reject(new Error('Upload failed'))
      }

      xhr.send(file)
    })
  }
}