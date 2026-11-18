import { ProfileWrapper, ProfileWrapperItem } from "./card-items";
import { ProfileContainer } from "./container";
import { FieldTile } from "./field-tile";
import { ProfileHeading } from "./heading";
import { ProfileTile } from "./tile";

export const Profile = Object.assign(ProfileContainer, {
  Card: ProfileWrapper,
  Container: ProfileContainer,
  FieldTile,
  Heading: ProfileHeading,
  Item: ProfileWrapperItem,
  Tile: ProfileTile,
});
