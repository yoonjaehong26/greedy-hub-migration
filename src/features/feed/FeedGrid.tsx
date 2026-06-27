'use client';

import styled from 'styled-components';
import { useSitesQuery } from '@/shared/core/queries/siteQueries';
import { useThemeStore } from '@/shared/core/stores/themeStore';
import { SiteCard } from './SiteCard';
import { useFeedColumns } from './useFeedColumns';

export function FeedGrid() {
  const { data: sites, isLoading, isError } = useSitesQuery();
  const toggle = useThemeStore((s) => s.toggle);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const columns = useFeedColumns();

  return (
    <Wrapper>
      <TopBar>
        <Wordmark>Greedy Hub</Wordmark>
        <Actions>
          <ThemeButton onClick={toggle} title="테마 전환">
            {colorScheme === 'light' ? '🌙' : '☀️'}
          </ThemeButton>
          <RegisterButton disabled title="등록 기능 준비 중">
            + 등록
          </RegisterButton>
        </Actions>
      </TopBar>

      <Content>
        {isLoading && <StatusMessage>불러오는 중…</StatusMessage>}
        {isError && <StatusMessage>목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</StatusMessage>}
        {!isLoading && !isError && sites?.length === 0 && (
          <EmptyState>
            <EmptyTitle>아직 등록된 프로젝트가 없어요</EmptyTitle>
            <EmptyDesc>첫 번째 프로젝트를 등록해 보세요</EmptyDesc>
          </EmptyState>
        )}
        {sites && sites.length > 0 && (
          <Grid $columns={columns}>
            {sites.map((site, index) => (
              <SiteCard
                key={site.id}
                site={site}
                featured={index === 0 && columns > 1}
              />
            ))}
          </Grid>
        )}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100dvh;
  background: var(--c-bg);
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  padding: 0 1.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(8px);
`;

const Wordmark = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--c-brand);
  letter-spacing: -0.02em;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0.25rem;
  border-radius: 0.375rem;
  line-height: 1;

  &:hover {
    background: var(--c-border);
  }
`;

const RegisterButton = styled.button`
  background: var(--c-brand);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: var(--c-brand-soft);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, 1fr);
  gap: 1rem;
  align-items: start;
`;

const StatusMessage = styled.p`
  text-align: center;
  color: var(--c-text-sub);
  padding: 3rem 0;
  font-size: 0.9375rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const EmptyTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 0.5rem;
`;

const EmptyDesc = styled.p`
  font-size: 0.875rem;
  color: var(--c-text-sub);
`;
