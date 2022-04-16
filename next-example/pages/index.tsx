import type { NextPage } from 'next'
import { Field, Form } from 'frmx'

const Home: NextPage = () => {
  return <div>
    <Form
      initialValues={{
        test: "aaa"
      }}
    >
      <Field path="test">
        <input />
      </Field>
    </Form>
    test
  </div>
}

export default Home
