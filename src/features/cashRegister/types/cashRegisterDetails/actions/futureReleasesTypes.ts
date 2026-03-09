export type FutureRelease = {
  releaseDate: Date | string;
  amount: number;
};

export type FutureReleasesParams = {
  cashRegisterId: string;
};

export type GetFutureReleasesInput = {
  cashRegisterId: string;
};

export type GetFutureReleasesResponse = FutureRelease[] | FutureRelease;
