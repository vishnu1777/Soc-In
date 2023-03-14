import User from "../models/User.js";

/* Read */
export const getUser = async (req, res) => {
  try {
    /* Get the id same like useParams() in react */
    const { id } = req.params;
    /* find the id data in mongo db */
    const user = await User.findById(id);
    /* send it to the front end */
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    /* multiple api calls */
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    /* format the friends object for sending to frontend */
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

/* Update */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);

    const friend = await User.findById(friendId);

    /* if user table has friend id then */
    if (user.friends.includes(friendId)) {
      /* remove the friend from the user and also from the friend */
      user.friends = user.friends.filter((_id) => _id !== friendId);
      friend.friends = friend.friends = friend.friends.filter(
        (_id) => _id !== id
      );
    } else {
      /* Else add him as a friend from both user and friend */
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    /* Send the friends list to front end */
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    /* format the friends object for sending to frontend */
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
