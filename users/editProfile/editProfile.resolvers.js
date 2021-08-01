import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");

    // !!!!! How to save pictures to a server !!!!!
    // const { filename, createReadStream } = await avatar;
    // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    // const readStream = createReadStream();
    // const writeStream = createWriteStream(
    //   process.cwd() + "/uploads/" + newFilename
    // );
    // readStream.pipe(writeStream);
    // avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }
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
      ...(avatarUrl && { avatar: avatarUrl }),
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
