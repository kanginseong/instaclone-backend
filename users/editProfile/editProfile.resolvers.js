import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio },
  { loggedInUser }
) => {
  console.log(loggedInUser);
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      // password: uglyPassword,
      // If uglyPassword is 'true', password is uglyPassword
      ...(uglyPassword && { password: uglyPassword }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
};
