import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  Spacer,
  Flex,
  Link,
  Text,
  useClipboard,
} from '@chakra-ui/react';

import { AndroidIcon, AppleIcon, BookmarkIcon } from '../icons';

import BookmarkletLink from './BookmarkletLink';

export default function IntegrationIcons({ sessionId, parentId }) {
  const [configForShortcut, setConfigForShortcut] = useState('');

  useEffect(() => {
    setConfigForShortcut(`${sessionId}\n${parentId}`);
  }, [sessionId, parentId]);

  const { onCopy } = useClipboard(configForShortcut);

  return (
    <Flex mr="auto" gridGap={2} alignItems="center">
      <Tooltip hasArrow label="Create iOS Shortcut">
        <span>
          <Link
            onClick={onCopy}
            href="https://www.icloud.com/shortcuts/6b2a92086fa74cb997bccb08491b0224"
            target="_blank"
          >
            <AppleIcon boxSize="2em" />
          </Link>
        </span>
      </Tooltip>
      <Spacer />
      <Tooltip hasArrow label="Add to your homescreen for quick use!">
        <span>
          <AndroidIcon boxSize="2em" />
        </span>
      </Tooltip>
      <Spacer />
      <Tooltip hasArrow label="Drag me to bookmark bar">
        <span>
          <BookmarkletLink sessionId={sessionId} parentId={parentId}>
            <BookmarkIcon aria-label="s2wf" boxSize="2em" />
            <Text display="none"> Send to WorkFlowy</Text>
          </BookmarkletLink>
        </span>
      </Tooltip>
    </Flex>
  );
}
