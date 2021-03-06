---
id: intro
title: Introduction
sidebar_position: 1
---

## Core ideas

- **Fight complexity with simplicity, not with more complexity**
- Start from the API you need and optimize for that
- Be **expressive**: Start from the data you need back
- Propose the most **versatile schema validation**
- **Benchmark driven** optimization
- Cover a **100% of use cases**

## Batteries-included

Out of the box, frmx provides:

- **Schema validation**
- Three levels of **diffing** (get only the updates you need)
- **Five wrapper components** that cover 90% of cases
- **One hook** that covers the remaining 9%
- **Another hook** that covers the remaining 1%
- **Tree shaking**

## How it works

To get both performance and flexibility with a simple API, `frmx` uses React's **context API only to store refs**, expose a few getter / setters methods and give forms a unique id. That way, updating form data doesn't trigger rerendering everything inside the `<Form/>` component.

**Fields keep track of their own state** and only update the refs as a **side effect**, while various events regarding form validity / submitting / resetting are passed through **synthetic events** that do not trigger rerenders of the context provider itself.

Those events are identified by a unique `id` to make sure no matter how many forms in one document and how nested they were, only the right components would get updated.

## Benchmarks

Benchmarking has prooved `frmx` to perform just as well as other form librairies out there (data has yet to be uploaded, feel free to check by yourself in the meantime), while providing a much simpler and flexible API and covering 100% of use cases, providing form data diffing and versatile schema validation, and assuming nothing about users' application architecture, component nesting or data shape.

### Note about benchmarking

Some libraries assume that performance is mesured in the React Profiler tab and use uncontrolled inputs based on this assumption.

The thing is, using uncontrolled components just reduces the number of things you will see in React's profiler, not the actual JavaScript execution time.

Performance can only be mesured in terms of execution time using Chrome's or Firefox's native perfomance tabs, where you can see there's actually no *measurable* performance overhead for using controlled components over uncontrolled.

If anything, this just gives you more opportunities of fine-tuning your code by giving you more ways of analyzing it.
