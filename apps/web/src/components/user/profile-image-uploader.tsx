"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc/client";
import { getCroppedImg } from "@/utils/cropImage";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";

interface ProfileImageUploaderProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export function ProfileImageUploader({ user }: ProfileImageUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(user.image);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getPresignedUrl = trpc.user.getUpdateImagePresignedUrl.useMutation();
  const confirmUpload = trpc.user.confirmUpload.useMutation();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const uploadFileWithProgress = (
    file: Blob,
    signedUrl: string,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Upload failed'))
      }

      xhr.send(file)

      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled'))
      })
    })
  }

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const fileName = `profile.jpeg`;
      const fileType = croppedBlob.type;
      const fileSize = croppedBlob.size;

      const { url, key, publicUrl } = await getPresignedUrl.mutateAsync({
        fileName,
        contentType: fileType,
        fileSize,
      });

      const uploadRes = await fetch(url, {
        method: "PUT",
        body: croppedBlob,
      });
      const controller = new AbortController();
      uploadFileWithProgress(croppedBlob, url, controller.signal);
      if (!uploadRes.ok) throw new Error("Falha no upload");

      await confirmUpload.mutateAsync({ key });

      setPreviewUrl(publicUrl);
      setShowCropDialog(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao enviar imagem",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-6 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-2xl">
            {user.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" onClick={handleClick}>
            Alterar foto
          </Button>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogHeader>
          <DialogTitle>Recortar imagem</DialogTitle>
          <DialogDescription>
            Recorte a imagem para melhor visualização.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className='w-full'>
          {imageSrc && (
            <div className="relative w-full h-[30vh] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          )}
          <DialogFooter>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowCropDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpload}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
