import React, { FC, ReactElement } from "react";

type Props = {};

const ChatSearchBar: FC<Props> = (props): ReactElement => {
  return (
    <div>
      <label
        htmlFor="search_chat"
        className="px-2 py-4 bg-white border-gray-500 rounded-xl"
      >
        <input
          type="text"
          name="search_chat"
          id="search_chat"
          className="outline-none border-none text-xl"
        />
      </label>
    </div>
  );
};

export default ChatSearchBar;
