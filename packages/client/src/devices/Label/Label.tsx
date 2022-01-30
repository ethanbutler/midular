import styled from "styled-components";

/**
 * Renders some editable text. This
 * doesn't have any musical significance;
 * it's just there so users can make their
 * own interfaces more obvious.
 *
 * TODO: Support for alignment.
 */
export function Label() {
  return <LabelInput defaultValue="" placeholder="Text" />;
}

const LabelInput = styled.input`
  display: block;
  background: none;
  border: none;
  width: 100%;
  color: white;
  text-align: center;
`;
