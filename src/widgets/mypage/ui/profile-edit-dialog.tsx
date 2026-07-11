"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const [previewUrl, setPreviewUrl] = useState(profile.profileImageUrl);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(profile.profileImageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profile.profileImageUrl, selectedFile]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [open]);

  const saveProfileImageMutation = useMutation({
    ...memberKeys.updateProfileImage(),
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
    // 스크롤 컨테이너(overflow-y-auto) 안에서 렌더되어 inset-0 만으로는 오버레이 높이가
    // 뷰포트 전체를 덮지 못하므로, 높이를 h-dvh(뷰포트 높이)로 명시한다.
    <div className="bg-overlay fixed inset-x-0 top-0 z-50 flex h-dvh items-center justify-center px-4">
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
              if (!selectedFile) return;
              saveProfileImageMutation.mutate(selectedFile);
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
