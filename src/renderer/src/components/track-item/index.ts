import Index from "./index.vue";
import Id from "./id.vue";
import Cover from "./cover.vue";
import Name from "./name.vue";
import Artists from "./artists.vue";
import Album from "./album.vue";
import Duration from "./duration.vue";
import Action from "./action.vue";

const TrackItem = Object.assign(Index, {
  Id,
  Cover,
  Name,
  Artists,
  Album,
  Duration,
  Action,
});

export default TrackItem;
