import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Grid } from './Grid'

export default {
  component: Grid,
  title: 'Grid'
} as ComponentMeta<typeof Grid>

const Template: ComponentStory<typeof Grid> = args => <Grid {...args}/>

export const Bare = Template.bind({})
Bare.args = {
  size: 16,
}

export const WithGridItems = Template.bind({})
WithGridItems.args = {
  ...Bare.args,
}