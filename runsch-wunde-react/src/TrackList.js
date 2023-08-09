import { createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { msToHMS } from './time';

const TrackContext = createContext(null);

const TrackList = ({ tracks }) => {
  return (
    <div>
      {tracks.map((track, i) => (
        <Track track={track} key={track ? track.id : i} />
      ))}
    </div>
  );
};

const Track = ({ track }) => {
  return (
    <TrackContext.Provider value={track}>
      <div
        className={`hoverable p-3 is-unselectable ${
          track ? 'is-clickable' : ''
        }`}
      >
        <div className="columns is-vcentered is-mobile">
          <div className="column is-narrow">
            <TrackCover />
            <AddToQueueIcon />
          </div>
          <div className="column is-clipped">
            <TrackName />
            <TrackExplicityAndArtists />
          </div>
          <div className="column is-clipped is-hidden-mobile">
            <TrackAlbum />
            <TrackRelease />
          </div>
          <div className="column is-narrow is-hidden-touch">
            <div style={{ width: '6ch' }} />
            <TrackDuration />
          </div>
        </div>
      </div>
    </TrackContext.Provider>
  );
};

const TrackCover = () => {
  const track = useContext(TrackContext);
  const url = track?.album.images.find((image) => image.width <= 64)?.url;
  return (
    <div className={`image cover is-48x48 ${track ? 'hover-hide' : ''}`}>
      {track ? (
        <img
          className="loading hide-alt"
          src={url}
          alt={`Album cover of ${track.album.name}`}
          title={track.album.name}
          draggable="false"
        />
      ) : (
        <div
          className="loading"
          title="Loading..."
          style={{ height: '100%' }}
        />
      )}
    </div>
  );
};

const AddToQueueIcon = () => {
  const track = useContext(TrackContext);
  if (!track) return;
  return (
    <div className="image cover is-48x48 hover-show is-relative">
      <FontAwesomeIcon className="center-absolute" icon={faPlus} size="xl" />
    </div>
  );
};

const TrackName = () => {
  const track = useContext(TrackContext);
  if (!track)
    return (
      <p
        className="text-placeholder"
        title="Loading..."
        style={{ '--length': 23 }}
      />
    );
  return (
    <p className="ellipsis" title={track.name}>
      <b>{track.name}</b>
    </p>
  );
};

const TrackExplicityAndArtists = () => {
  const track = useContext(TrackContext);
  return track ? (
    <p className="vcentered">
      <TrackExplicity />
      <TrackArtists />
    </p>
  ) : (
    <p
      className="text-placeholder"
      title="Loading..."
      style={{ '--length': 18 }}
    />
  );
};

const TrackExplicity = () => {
  const track = useContext(TrackContext);
  if (!track?.explicit) return;
  return (
    <>
      <span className="tag has-background-grey has-text-light" title="Explicit">
        E
      </span>
      <span className="pr-1" />
    </>
  );
};

const TrackArtists = () => {
  const track = useContext(TrackContext);
  if (!track) return;
  const artists = track.artists.map((artist) => artist.name).join(', ');
  return (
    <span className="ellipsis" title={artists}>
      {artists}
    </span>
  );
};

const TrackAlbum = () => {
  const track = useContext(TrackContext);
  if (!track)
    return (
      <p
        className="text-placeholder"
        title="Loading..."
        style={{ '--length': 25 }}
      />
    );
  return (
    <p className="ellipsis" title={track.album.name}>
      {track.album.name}
    </p>
  );
};

const TrackRelease = () => {
  const track = useContext(TrackContext);
  if (!track)
    return (
      <p
        className="text-placeholder"
        title="Loading..."
        style={{ '--length': 4 }}
      />
    );
  const year = new Date(track.album.release_date).getFullYear();
  return (
    <p className="has-text-grey ellipsis" title={year}>
      {year}
    </p>
  );
};

const TrackDuration = () => {
  const track = useContext(TrackContext);
  if (!track)
    return (
      <p
        className="text-placeholder ml-auto"
        title="Loading..."
        style={{ '--length': 4 }}
      />
    );
  return <p className="has-text-right">{msToHMS(track.duration_ms)}</p>;
};

export default TrackList;
