'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/shared/core/constants/theme';
import type { Site } from '@/shared/core/types/site';
import { useSiteThumbnail } from './useSiteThumbnail';

interface Props {
  site: Site;
  featured?: boolean;
}

export function SiteCard({ site, featured = false }: Props) {
  const router = useRouter();
  const screenshotUrl = useSiteThumbnail(site);
  const [imgError, setImgError] = useState(false);

  const showImage = screenshotUrl && !imgError;

  return (
    <Card
      $featured={featured}
      onClick={() => router.push(`/live/${site.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/live/${site.id}`)}
    >
      <Thumbnail $color={site.thumbnailColor}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={screenshotUrl}
            alt={site.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Fallback $color={site.thumbnailColor}>
            <FallbackDomain>{site.domain}</FallbackDomain>
            <FallbackCount>{site.pages.length}페이지</FallbackCount>
          </Fallback>
        )}
      </Thumbnail>
      <Info>
        <Title>{site.title}</Title>
        <Description>{site.description}</Description>
        <Domain>{site.domain}</Domain>
      </Info>
    </Card>
  );
}

const Card = styled.article<{ $featured: boolean }>`
  grid-column: ${(p) => (p.$featured ? 'span 2' : 'span 1')};
  background: var(--c-surface);
  border-radius: ${theme.radius.card};
  box-shadow: ${theme.shadow.card};
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadow.cardHover};
  }

  &:focus-visible {
    outline: 2px solid var(--c-brand);
    outline-offset: 2px;
  }
`;

const Thumbnail = styled.div<{ $color: string }>`
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${(p) => p.$color};
  overflow: hidden;
`;

const Fallback = styled.div<{ $color: string }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${(p) => p.$color}cc, ${(p) => p.$color}66);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const FallbackDomain = styled.span`
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
`;

const FallbackCount = styled.span`
  color: #fff;
  font-size: 0.75rem;
  opacity: 0.7;
`;

const Info = styled.div`
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  font-size: 0.8125rem;
  color: var(--c-text-sub);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Domain = styled.span`
  font-size: 0.75rem;
  color: var(--c-brand);
  margin-top: 0.25rem;
`;
