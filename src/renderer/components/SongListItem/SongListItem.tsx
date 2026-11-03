import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faDownload,
  faSpinner,
  faCheck,
  faPlay,
  faPause,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import appIcon from '../../../../assets/icon.png';
import { stripColorMarkup } from '../../../colorMarkup';
import { Song } from '../../../types';
import { cn } from '../../cn';
import { Button, Popconfirm, Tooltip } from 'antd';
import { popoverStyles } from '../../overlayStyles';
import { useEffect, useMemo, useState } from 'react';
import { NARROW_TITLE_MAX, shortenTitle } from './shortenTitle';
import { SongMenu } from '../SongMenu';
import { Stars } from '../Stars';
import { IconButton } from '../IconButton';
import { Difficulty } from 'scan-chart';
import { calculateAccuracy, getStarRating } from '../../scoring';
import { DifficultyRing } from './DifficultyRing';
import { OnlineSong } from '../../types';

export interface SongListItemProps {
  songData: Song | OnlineSong;
  onLikeChange: (id: string, liked: boolean) => void;
  onDownload: (id: string) => void;
  onClick: () => void;
  onSplit: (id: string) => void;
  downloading?: boolean;
  difficulty: Difficulty;
  splitting: boolean;
  downloaded?: boolean;
  downloadingDisabled: boolean;
  focused?: boolean;
  canPreview?: boolean;
  previewing?: boolean;
  onPreview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCharterClick?: (charter: string) => void;
}

const NARROW_WINDOW = '(max-width: 1100px)';
const MOBILE_WINDOW = '(max-width: 640px)';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function RemoveButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Popconfirm
      title="Remove this song from your library?"
      description="The files will be deleted from your folder."
      okText="Remove"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      placement="left"
      icon={null}
      styles={popoverStyles}
      onConfirm={onConfirm}
    >
      <IconButton
        data-testid="delete-song"
        aria-label="Remove from library"
        icon={faTrash}
        type="danger"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );
}

function PreviewButton({
  playing,
  onClick,
}: {
  playing: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      data-testid="preview-button"
      aria-label={playing ? 'Stop preview' : 'Preview song'}
      icon={playing ? faPause : faPlay}
      type={playing ? 'primary' : 'default'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    />
  );
}

export function SongListItem({
  songData,
  onLikeChange,
  onDownload,
  onClick,
  downloading,
  downloaded,
  difficulty,
  splitting,
  onSplit,
  downloadingDisabled,
  focused,
  canPreview,
  previewing,
  onPreview,
  onDelete,
  onCharterClick,
}: SongListItemProps) {
  const local = 'source' in songData ? undefined : songData;
  const { albumCover, id, name, artist, charter, drumDifficulty } = songData;
  const charterLabel = charter ? stripColorMarkup(charter) : '';
  const narrow = useMediaQuery(NARROW_WINDOW);
  const mobile = useMediaQuery(MOBILE_WINDOW);
  const displayName =
    narrow && !mobile ? shortenTitle(name, NARROW_TITLE_MAX) : name;
  const score = useMemo(() => {
    const result = local?.scoreData?.[difficulty];

    return result
      ? {
          starRating: getStarRating(result),
          accuracy: calculateAccuracy(result),
        }
      : null;
  }, [local, difficulty]);
  const indicator = useMemo(() => {
    if (local) {
      return (
        <div className="flex h-full flex-col items-center gap-2 mobile:h-auto">
          <SongMenu
            dir={local.dir}
            canSplit={(local.audio?.length ?? 0) === 1}
            splitting={splitting}
            onSplit={() => onSplit(id)}
            onDelete={() => onDelete?.(id)}
          />

          <IconButton
            data-testid="like-toggle"
            type={local.liked ? 'primary' : 'default'}
            className="mt-auto mobile:h-11 mobile:w-11"
            icon={local.liked ? faHeartSolid : faHeart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLikeChange(id, !local.liked);
            }}
          />
        </div>
      );
    }

    if (!downloading && !downloaded) {
      const button = (
        <Button
          icon={<FontAwesomeIcon icon={faDownload} />}
          disabled={downloadingDisabled}
          data-testid="download-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDownload(id);
          }}
        />
      );

      return downloadingDisabled ? (
        <Tooltip
          title="To enable download, select library folder"
          placement="left"
        >
          {button}
        </Tooltip>
      ) : (
        button
      );
    }

    if (downloading) {
      return (
        <FontAwesomeIcon
          className="text-text-dim px-1.5"
          size="xl"
          icon={faSpinner}
          spin
          data-testid="downloading-indicator"
        />
      );
    }

    return (
      <div className="flex items-center gap-2">
        {onPreview && canPreview ? (
          <PreviewButton
            playing={Boolean(previewing)}
            onClick={() => onPreview(id)}
          />
        ) : (
          <FontAwesomeIcon
            className="text-accent px-1.5"
            size="xl"
            icon={faCheck}
            data-testid="downloaded-indicator"
          />
        )}
        {onDelete && <RemoveButton onConfirm={() => onDelete(id)} />}
      </div>
    );
  }, [
    downloading,
    downloaded,
    onDownload,
    id,
    local,
    onLikeChange,
    downloadingDisabled,
    onSplit,
    splitting,
    onPreview,
    onDelete,
    canPreview,
    previewing,
  ]);

  return (
    <div className="relative inline-flex w-full">
      <div
        onClick={onClick}
        data-testid={`song-item-${id}`}
        data-focused={focused ? 'true' : undefined}
        className={cn(
          'grid min-w-0 grow grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-x-5 gap-y-1 border border-border-soft no-underline bg-surface rounded-[11px] transition-all duration-100 ease-in-out cursor-default p-2',
          'mobile:grid-cols-[3.75rem_minmax(0,1fr)_auto] mobile:gap-x-2',
          {
            'hover:bg-accent-soft-bg hover:border-accent-soft-border cursor-pointer':
              Boolean(local),
            'bg-accent-soft-bg border-accent-soft-border outline-2 outline-accent':
              focused,
          },
        )}
      >
        <div className="relative h-15 w-15 shrink-0 mobile:col-start-1 mobile:row-span-2 mobile:row-start-1">
          <img
            src={albumCover ?? appIcon}
            onError={(e) => {
              e.currentTarget.src = appIcon;
            }}
            className="h-15 w-15 object-cover aspect-square rounded-lg shadow-frame"
          />
          {local && onPreview && canPreview && (
            <button
              type="button"
              data-testid="preview-button"
              aria-label={previewing ? 'Stop preview' : 'Preview song'}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-0 bg-bg/90 text-text shadow-frame cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(id);
              }}
            >
              <FontAwesomeIcon icon={previewing ? faPause : faPlay} size="sm" />
            </button>
          )}
        </div>

        <div className="min-w-0 mobile:col-start-2 mobile:row-start-1">
          <div
            className="mb-0.5 truncate text-[18px] font-bold text-text-body font-display"
            title={name}
          >
            {displayName}
          </div>
          <div className="truncate text-sm text-text-muted font-ui">
            {artist}
          </div>
        </div>

        {(charterLabel || local) && (
          <div className="flex min-w-0 items-center justify-end gap-5 mobile:col-start-2 mobile:row-start-2 mobile:w-full mobile:gap-3">
            {charterLabel && (
              <div className="flex max-w-40 shrink flex-col items-end mobile:mr-auto mobile:min-w-0 mobile:max-w-none mobile:flex-1 mobile:flex-row mobile:items-baseline mobile:gap-1">
                <div className="text-xs text-text-dim">charter</div>
                <button
                  type="button"
                  data-testid="charter-link"
                  title={`Search charts by ${charterLabel}`}
                  className="mt-1 max-w-full truncate border-0 bg-transparent p-0 text-left text-sm text-text-muted cursor-pointer hover:text-accent hover:underline mobile:mt-0"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onCharterClick?.(charterLabel);
                  }}
                >
                  {charterLabel}
                </button>
              </div>
            )}

            {local && (
              <div className="flex shrink-0 flex-col items-center gap-1 mobile:flex-row mobile:gap-2">
                <div className="text-xs text-text-dim">{difficulty}</div>
                <Stars
                  rating={score ? score.starRating : 0}
                  perfect={Boolean(score && score.accuracy === 1)}
                  size="xs"
                  className="gap-1"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-5 mobile:col-start-3 mobile:row-span-2 mobile:row-start-1 mobile:gap-2">
          <DifficultyRing value={drumDifficulty} />
          {indicator}
        </div>
      </div>
    </div>
  );
}
