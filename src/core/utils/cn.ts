import classnames, { type Argument } from 'classnames'

export function cn(...inputs: Argument[]): string {
  return classnames(...inputs)
}
