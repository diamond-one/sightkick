import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider } from 'antd';
import { Tooltip } from '../Tooltip';
import themedark from '../../theme';
import { DEFAULT_UNMUTE_VOLUME } from './constants';
import { AudioVolume } from '../AudioVolume';
import { useMuteToggle } from '../../hooks/useMuteToggle';
import { cn } from '../../cn';
import { Subdivision, subdivisionChoices } from '../../services/click-track';
import { NoteIcon } from './NoteIcon';

export interface ClickControlsProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  tone: number;
  onToneChange: (value: number) => void;
  isCompound: boolean;
  denominator: number;
  subdivision: Subdivision;
  onSubdivisionChange: (value: Subdivision) => void;
}

export function ClickControls({
  volume,
  onVolumeChange,
  tone,
  onToneChange,
  isCompound,
  denominator,
  subdivision,
  onSubdivisionChange,
}: ClickControlsProps) {
  const { isMuted, toggleMute, handleChange } = useMuteToggle(
    volume,
    onVolumeChange,
    DEFAULT_UNMUTE_VOLUME,
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className="grow h-px"
          style={{ background: 'var(--gradient-faint-fade-reverse)' }}
        />
        <div className="flex items-center gap-2">
          <div className="text-text-faint uppercase font-semibold text-[13px]">
            Click Track
          </div>

          <Tooltip
            title="Clicks on the beat stay strong. Notes between the beats are quieter."
            placement="bottom"
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              color={themedark.color.textFaint}
            />
          </Tooltip>
        </div>
        <div
          className="grow h-px"
          style={{ background: 'var(--gradient-faint-fade)' }}
        />
      </div>
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Click subdivision"
      >
        {subdivisionChoices(isCompound, denominator).map((choice) => {
          const selected = choice.id === subdivision;

          return (
            <Tooltip key={choice.id} title={choice.label} placement="bottom">
              <button
                type="button"
                aria-pressed={selected}
                aria-label={choice.label}
                data-testid={`subdivision-${choice.id}`}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg border-0 text-white cursor-pointer',
                  selected ? 'bg-accent' : 'bg-[#7e8b96] hover:bg-[#8d99a3]',
                )}
                onClick={() => onSubdivisionChange(choice.id)}
              >
                <NoteIcon glyph={choice.glyph} />
              </button>
            </Tooltip>
          );
        })}
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,max-content)_minmax(0,1fr)_max-content_max-content] items-center gap-x-2 gap-y-2 @max-[26rem]:grid-cols-[minmax(0,1fr)_auto_auto]">
        <AudioVolume
          name="Volume"
          volume={volume}
          onChange={handleChange}
          isMuted={isMuted}
          canSolo={false}
          onMuteClick={toggleMute}
        />

        <div className="truncate text-xs text-text @max-[26rem]:col-span-3">
          Tone
        </div>
        <Slider
          value={tone}
          onChange={onToneChange}
          className="col-span-3 m-0 min-w-0"
        />
      </div>
    </>
  );
}
