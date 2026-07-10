import { http, HttpResponse } from 'msw';
import { MEMBERS, type MockMember } from '../data/members';
import type { MemberDetail, UpdateMemberPayload } from '@/shared/core/types/member';

/** MockMember의 선택 필드를 실계약(MemberDetail)이 보장하는 기본값으로 채운다. */
function toMemberDetail(member: MockMember): MemberDetail {
  return {
    ...member,
    bio: member.bio ?? null,
    isPublic: member.isPublic ?? true,
    summaryCounts: member.summaryCounts ?? { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
    completedMissions: member.completedMissions ?? [],
    blogPosts: member.blogPosts ?? [],
    teamProjects: member.teamProjects ?? [],
    activities: member.activities ?? [],
  };
}

export const memberHandlers = [
  http.get('*/api/members', () => {
    return HttpResponse.json({
      items: MEMBERS.map(({ id, login, name, memberships, avatarUrl, missionDashboardUrl, joinType }) => ({
        id,
        login,
        name,
        memberships,
        avatarUrl,
        missionDashboardUrl,
        joinType,
      })),
    });
  }),

  http.get('*/api/members/:id', ({ params }) => {
    const { id } = params;
    const member = MEMBERS.find((m) => String(m.id) === id || m.login === id);

    if (!member) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '멤버를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    return HttpResponse.json(toMemberDetail(member));
  }),

  http.patch('*/api/members/:id', async ({ params, request }) => {
    const { id } = params;
    const member = MEMBERS.find((m) => String(m.id) === id || m.login === id);

    if (!member) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '멤버를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    const payload = (await request.json()) as UpdateMemberPayload;
    if (payload.bio !== undefined) member.bio = payload.bio;
    if (payload.isPublic !== undefined) member.isPublic = payload.isPublic;

    return HttpResponse.json(toMemberDetail(member));
  }),
];
