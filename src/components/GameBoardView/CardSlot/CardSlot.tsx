import { Song } from "../../../datatypes/Song";

interface CardSlotProps {
  song: Song | null;
}

export const CardSlot: React.FC<CardSlotProps> = ({ song }) => {
  return (
    <div
      className={`card-slot ${song ? "filled-slot" : "empty-slot"}`}
    >
      {song ? (
        <>
          <h4>{song.title}</h4>
          <p>{song.artist}</p>
          <p>{song.releaseYear}</p>
        </>
      ) : (
        <p className="placeholder">Empty Slot</p>
      )}
    </div>
  );
};
