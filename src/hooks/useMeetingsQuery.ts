import { useQuery } from "@tanstack/react-query";
import type { GetMeetingsParams } from "@/api/meeting.api";
import { getMeetings } from "@/api/meeting.api";

export const useMeetingsQuery = (params: GetMeetingsParams) => {
  const meetingsResponse = useQuery({
    queryKey: ["meetings", params],
    queryFn: () => getMeetings(params),
    retry: 1,
  });

  return meetingsResponse;
};
