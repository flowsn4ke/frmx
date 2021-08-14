---
id: iterations
title: Iterations
sidebar_position: 5
---

`frmx` went through a few iterations in order to reack its current level of performance.

## Version 1

The first obvious thing to do was to use React's context API, which allows for nesting and makes passing data around a breeze.

However, if you're not careful React's context triggers rerenders whenever the context's values are updated, making it a nightmare for forms since all components inside the context would be rerendered of pretty much each and every keystroke.

## Version 2

The next thing to try was to reach for **memoization**, which solved that problem. However, benchmarking showed that, while providing an ok performance, this solution wasn't ideal either.

## Version 3

The last iteration was to use `refs` to store the form data and inverse control. All fields control themselves and just update the ref stored in the context as a side effect, since refs are outside of React's control and therefore never trigger rerenders. However the last missing piece was the ability to pass messages around without triggering rerenders to keep track of general form validity and submit / reset events. The solution was retrospectively obvious: **Synthetic events**, identified by a unique `id` to make sure no matter how many forms in one document and how nested they were, only the right components would get updated.

**That way we now get the best of all worlds! Context's flexibility and high performance by keeping the state local to the components they control.**
