"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberKeys } from "@/entities/member/api/member-keys";
import type { MemberProfile } from "@/entities/member/model/member-profile";
import { CheckCircleIcon } from "@/shared/assets/CheckCircleIcon";
import { CloseIcon } from "@/shared/assets/CloseIcon";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { PlusCircleIcon } from "@/shared/assets/PlusCircleIcon";

interface ProfileEditDialogProps {
  open: boolean;
  profile: MemberProfile;
  onClose: () => void;
}

export function ProfileEditDialog({ open, profile, onClose }: ProfileEditDialogProps) {
  const queryClient = useQueryClient();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return profile.profileImageUrl;
    return URL.createObjectURL(selectedFile);
  }, [profile.profileImageUrl, selectedFile]);

  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [open]);

  const saveProfileImageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) return profile.profileImageUrl;
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(selectedFile);
      });
    },
    onSuccess: (profileImageUrl) => {
      queryClient.setQueryData<MemberProfile>(memberKeys.me().queryKey, {
        ...profile,
        profileImageUrl,
      });
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="bg-overlay fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="bg-surface w-full max-w-[434px] rounded-[28px] px-8 py-7 shadow-[0_24px_60px_rgb(17_17_17_/_0.16)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading font-bold">프로필 수정</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="border-line bg-surface-subtle flex size-9 items-center justify-center rounded-full border"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="bg-surface-subtle border-line flex size-40 items-center justify-center overflow-hidden rounded-full border">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="size-full object-cover" />
            ) : (
              <LogoIcon className="text-accent size-24" />
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null);
          }}
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label
            htmlFor={inputId}
            className="border-line bg-surface-subtle text-foreground inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium"
          >
            <PlusCircleIcon className="size-5" />
            업로드
          </label>

          <button
            type="button"
            onClick={() => {
              void saveProfileImageMutation.mutateAsync();
            }}
            disabled={!selectedFile || saveProfileImageMutation.isPending}
            className="bg-accent text-foreground-inverse inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircleIcon className="size-5" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
