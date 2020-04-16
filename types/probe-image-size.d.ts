interface ImageDescriptor {
  width: number
  height: number
  type: string
  mime: string
  wUnits: string
  hUnits: string
  url: string
}

declare module 'probe-image-size' {
  const probe: (url: string) => Promise<ImageDescriptor>
  export default probe
}
