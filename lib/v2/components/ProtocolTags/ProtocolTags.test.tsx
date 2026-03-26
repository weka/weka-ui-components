import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProtocolTags } from './ProtocolTags'

describe('ProtocolTags', () => {
  describe('Rendering Individual Protocols', () => {
    it('renders SMB tag when smb is enabled', () => {
      render(<ProtocolTags protocolsEnabled={{ smb: true }} />)

      expect(screen.getByText('SMB')).toBeInTheDocument()
    })

    it('renders NFS tag when nfs is enabled', () => {
      render(<ProtocolTags protocolsEnabled={{ nfs: true }} />)

      expect(screen.getByText('NFS')).toBeInTheDocument()
    })

    it('renders S3 tag when s3 is enabled', () => {
      render(<ProtocolTags protocolsEnabled={{ s3: true }} />)

      expect(screen.getByText('S3')).toBeInTheDocument()
    })

    it('renders Tier tag when tier is enabled', () => {
      render(<ProtocolTags protocolsEnabled={{ tier: true }} />)

      expect(screen.getByText('Tier')).toBeInTheDocument()
    })

    it('does not render SMB tag when smb is false', () => {
      render(<ProtocolTags protocolsEnabled={{ smb: false }} />)

      expect(screen.queryByText('SMB')).not.toBeInTheDocument()
    })

    it('does not render any tags when all protocols are disabled', () => {
      render(
        <ProtocolTags
          protocolsEnabled={{ smb: false, nfs: false, s3: false, tier: false }}
        />
      )

      expect(screen.queryByText('SMB')).not.toBeInTheDocument()
      expect(screen.queryByText('NFS')).not.toBeInTheDocument()
      expect(screen.queryByText('S3')).not.toBeInTheDocument()
      expect(screen.queryByText('Tier')).not.toBeInTheDocument()
    })

    it('renders empty when protocolsEnabled is empty object', () => {
      const { container } = render(<ProtocolTags protocolsEnabled={{}} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.children).toHaveLength(0)
    })
  })

  describe('Multiple Protocols', () => {
    it('renders multiple tags when multiple protocols enabled', () => {
      render(<ProtocolTags protocolsEnabled={{ smb: true, nfs: true }} />)

      expect(screen.getByText('SMB')).toBeInTheDocument()
      expect(screen.getByText('NFS')).toBeInTheDocument()
    })

    it('renders all four tags when all protocols enabled', () => {
      render(
        <ProtocolTags
          protocolsEnabled={{ smb: true, nfs: true, s3: true, tier: true }}
        />
      )

      expect(screen.getByText('SMB')).toBeInTheDocument()
      expect(screen.getByText('NFS')).toBeInTheDocument()
      expect(screen.getByText('S3')).toBeInTheDocument()
      expect(screen.getByText('Tier')).toBeInTheDocument()
    })

    it('renders tags in correct order (SMB, NFS, S3, Tier)', () => {
      const { container } = render(
        <ProtocolTags
          protocolsEnabled={{ smb: true, nfs: true, s3: true, tier: true }}
        />
      )

      const wrapper = container.firstChild as HTMLElement
      const tags = wrapper.querySelectorAll('span')
      expect(tags[0]).toHaveTextContent('SMB')
      expect(tags[1]).toHaveTextContent('NFS')
      expect(tags[2]).toHaveTextContent('S3')
      expect(tags[3]).toHaveTextContent('Tier')
    })
  })

  describe('Size Variants', () => {
    it('applies large size class by default', () => {
      render(<ProtocolTags protocolsEnabled={{ smb: true }} />)

      const tag = screen.getByText('SMB')
      expect(tag.className).toContain('protocolLarge')
    })

    it('applies large size class when size is "large"', () => {
      render(
        <ProtocolTags
          protocolsEnabled={{ smb: true }}
          size='large'
        />
      )

      const tag = screen.getByText('SMB')
      expect(tag.className).toContain('protocolLarge')
    })

    it('applies small size class when size is "small"', () => {
      render(
        <ProtocolTags
          protocolsEnabled={{ smb: true }}
          size='small'
        />
      )

      const tag = screen.getByText('SMB')
      expect(tag.className).toContain('protocolSmall')
    })

    it('applies size class to all tags', () => {
      render(
        <ProtocolTags
          protocolsEnabled={{ smb: true, nfs: true }}
          size='small'
        />
      )

      expect(screen.getByText('SMB').className).toContain('protocolSmall')
      expect(screen.getByText('NFS').className).toContain('protocolSmall')
    })
  })

  describe('Styling', () => {
    it('applies protocol-specific class to SMB', () => {
      render(<ProtocolTags protocolsEnabled={{ smb: true }} />)

      const tag = screen.getByText('SMB')
      expect(tag.className).toContain('protocolSmb')
    })

    it('applies protocol-specific class to NFS', () => {
      render(<ProtocolTags protocolsEnabled={{ nfs: true }} />)

      const tag = screen.getByText('NFS')
      expect(tag.className).toContain('protocolNfs')
    })

    it('applies protocol-specific class to S3', () => {
      render(<ProtocolTags protocolsEnabled={{ s3: true }} />)

      const tag = screen.getByText('S3')
      expect(tag.className).toContain('protocolS3')
    })

    it('applies protocol-specific class to Tier', () => {
      render(<ProtocolTags protocolsEnabled={{ tier: true }} />)

      const tag = screen.getByText('Tier')
      expect(tag.className).toContain('protocolTier')
    })

    it('applies extraClass to container', () => {
      const { container } = render(
        <ProtocolTags
          extraClass='custom-class'
          protocolsEnabled={{ smb: true }}
        />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })

    it('applies protocols class to container', () => {
      const { container } = render(
        <ProtocolTags protocolsEnabled={{ smb: true }} />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('protocols')
    })
  })
})
