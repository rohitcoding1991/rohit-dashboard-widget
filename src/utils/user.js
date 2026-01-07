import { getBackofficeUrl } from "../constants";

/**
 * @param {{ id: number, has_picture: boolean, picture?: string }} user
 * @return {string|null}
 */
export const getUserPictureByUser = (user) => {
  if (user && "has_picture" in user && user.has_picture) {
    if ("picture" in user && user.picture) {
      return user.picture;
    }

    return `${getBackofficeUrl()}/api/user/${user.id}/picture`;
  }

  return null;
};
