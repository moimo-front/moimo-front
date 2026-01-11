import { useQuery } from "@tanstack/react-query";
import type { GetMeetingsParams } from "@/api/meeting.api";
import { getMeetings } from "@/api/meeting.api";

export const useMeetingsQuery = (params: GetMeetingsParams) => {
  const meetingsResponse = useQuery({
    queryKey: ["meetings", params],
    queryFn: async () => await getMeetings(params),
  });

  return meetingsResponse;
};
