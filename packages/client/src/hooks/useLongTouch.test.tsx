import { act } from "react-dom/test-utils";
import { render, screen, fireEvent, wait } from "test-utils";
import { useLongTouch } from "./useLongTouch";

test("should return the current state", async () => {
  const Implementation = () => {
    const [ref, isLongTouched] = useLongTouch();

    return <div ref={ref}>{isLongTouched ? "yes" : "no"}</div>;
  };

  render(<Implementation />);
  const el = screen.getByText("no");
  act(() => {
    fireEvent.mouseDown(el);
  });
  await screen.findByText("yes");
});

// TODO: This test pases, but has an act() error
test("should allow specifying a timeout", async () => {
  const Implementation = () => {
    const [ref, isLongTouched] = useLongTouch(10);

    return <div ref={ref}>{isLongTouched ? "yes" : "no"}</div>;
  };

  render(<Implementation />);
  const el = screen.getByText("no");
  act(() => {
    fireEvent.mouseDown(el);
  });
  await wait(5);
  expect(screen.queryByText("yes")).toBe(null);
  await wait(10);
  screen.getByText("yes");
});
