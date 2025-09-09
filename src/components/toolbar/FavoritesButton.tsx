"use client";

interface FavoritesButtonProps {
    className?: string;
}

export default function FavoritesButton({ className }: FavoritesButtonProps ) {
  return (
    <button className={'${className || ""}'}>
      ⭐ Favorites
    </button>
  );
}

