import { millisecondToSecond } from "./toolkit";

const _rawApi = window.api;

const t = (track: any) => {
  if (track["fee"]) {
    track = {
      ...track,
      isBlock: track.fee === 0,
      isVip: track.fee === 1,
      isNeedPurchaseAlbum: track.fee === 4,
      isFreeWithLowQuality: track.fee === 8,
    };
  }
  if (track["dt"] || track["duration"]) {
    track = {
      ...track,
      duration: millisecondToSecond(track["dt"] || track["duration"]),
    };
  }
  return track;
};

const p = (playlist: any) => {
  const specialType = playlist["specialType"];
  if (specialType === 20) {
    playlist = {
      ...playlist,
      isAnnual: true,
    };
  }
  if (specialType === 5) {
    playlist = {
      ...playlist,
      isMyLike: true,
    };
  }
  return playlist;
};

const wrapApi = (api: any, getCookie: () => string) => {
  const result: any = {};
  for (const key of Object.keys(api)) {
    if (typeof api[key] === "function") {
      result[key] = (params = {}) =>
        api[key]({ ...params, cookie: getCookie() });
    } else {
      result[key] = api[key];
    }
  }
  return result;
};

class NeteaseCloudMusic {
  static instance: NeteaseCloudMusic;
  private cookie = "";
  private api = _rawApi;

  constructor() {
    this.api = wrapApi(_rawApi, () => this.cookie);
  }

  static init = () => {
    if (!this.instance) {
      const instance = new NeteaseCloudMusic();

      const asyncHandler = {
        get: (target, prop, receiver) => {
          const value = Reflect.get(target, prop, receiver);

          if (typeof value === "object" && value !== null) {
            return new Proxy(value, asyncHandler);
          }

          if (
            typeof value === "function" &&
            value.constructor.name === "AsyncFunction"
          ) {
            return async (...args) => {
              try {
                return await value.apply(target, args);
              } catch (error) {
                console.error(
                  `${prop} error in NeteaseCloudMusicHandler:`,
                  error
                );
                return null;
              }
            };
          }
          return value;
        },
      };

      this.instance = new Proxy(instance, asyncHandler);
    }

    return this.instance;
  };

  setCookie = (cookie) => (this.cookie = cookie);

  private getTrackPlayUrl = async (ids) => {
    const res = await this.api.song_url({ id: ids.join(",") });
    return res.body.data;
  };

  private getMvPlayUrl = async (id) => {
    const res = await this.api.mv_url({ id });
    return res.body.data;
  };

  getPlayUrl = async (
    type: "track" | "mv",
    ...ids: string[] | number[]
  ): Promise<any> => {
    try {
      if (type === "track") {
        return this.getTrackPlayUrl(ids);
      }
      return this.getMvPlayUrl(ids[0]);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  login = {
    qr: (() => {
      let qrKey = "";

      const generateKey = async (): Promise<{
        qrurl: string;
        qrimg: string;
        key: string;
      }> => {
        const keyRes = await this.api.login_qr_key({});
        qrKey = keyRes.body.data.unikey;
        const createdRes = await this.api.login_qr_create({ key: qrKey });
        return {
          ...createdRes.body.data,
          key: qrKey,
        };
      };

      const check = async (key: string) => {
        if (!key) {
          throw new Error(
            "QR key is not generated. Please call generateKey() first."
          );
        }
        const res = await this.api.login_qr_check({ key });
        return res.body;
      };

      return { generateKey, check };
    })(),

    status: async (): Promise<{ isLogin: boolean; [key: string]: any }> => {
      const res = await this.api.login_status({});
      const data = res.body.data;
      return {
        ...data,
        isLogin: !data.account?.anonimousUser,
      };
    },
  };

  logout = async () => (await this.api.logout({})).body;

  playlist = {
    recommend: async () => (await this.api.personalized({})).body.result,
    daily: async () => (await this.api.recommend_resource({})).body.recommend,
    detail: async (id: number) =>
      (await this.api.playlist_detail({ id })).body.playlist,
    tracks: async (id: number) => {
      const res = await this.api.playlist_track_all({ id });
      let songs = res.body.songs;
      songs = songs.map((song) => t(song));
      return songs;
    },
    subscribed: async (uid: number, limit = 10, offset = 0) => {
      const list = (await this.api.user_playlist({ uid, limit, offset })).body
        .playlist;
      return list.map((item) => p(item));
    },
  };

  track = {
    detail: async (...idArray: number[]) => {
      const ids = idArray.join(",");
      const res = await this.api.song_detail({ ids });
      let songs = res.body.songs;
      const data = await this.getPlayUrl("track", ids);
      if (!data) {
        throw new Error("Can not get play url");
      }
      return songs.map((song) =>
        t({
          ...song,
          src: data.filter((item) => item.id === song.id)[0].url,
        })
      );
    },
    liked: async (uid: number) => {
      const ids = (await this.api.likelist({ uid })).body.ids;
      const res = (await this.api.song_detail({ ids: ids.join(",") })).body;
      return res.songs;
    },
  };

  user = {
    stats: async () => (await this.api.user_subcount({})).body,
    detail: async (uid: number) => {
      const res = await this.api.user_detail({ uid });
      console.log(res);
    },
  };

  artist = {
    followed: async () => (await this.api.artist_sublist({})).body,
    detail: async (id: number) => {
      const res = await this.api.artist_detail({ id });
      const data = res.body.data;
      console.log(res);
      return {
        artist: data.artist,
        user: data.user,
        isBlacklist: data.blacklist,
      };
    },
    mv: async (id: number) => {
      const res = await this.api.artist_mv({ id });
      const body = res.body;
      return {
        more: body.hasMore,
        mvs: body.mvs,
      };
    },
    album: async (id: number) => {
      const res = await this.api.artist_album({ id });
      const body = res.body;
      return {
        hot: body.hotAlbums,
        more: body.more,
      };
    },
    top: {
      track: async (id: number) => {
        const res = await this.api.artist_top_song({ id });
        const topTracks = res.body.songs;
        return {
          topTracks,
          more: res.body.more,
        };
      },
    },
  };
  mv = {
    url: async (id: number) => {
      const res = await this.api.mv_url({ id });
      return res.body;
    },
  };
}

export default NeteaseCloudMusic;
