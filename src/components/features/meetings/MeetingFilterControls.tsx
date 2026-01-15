import type {
  FinishedFilterType,
  InterestFilterType,
  SortType,
} from "@/api/meeting.api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Interest } from "@/models/interest.model";
import { sortOptions } from "@/constants/sort";

interface MeetingFilterControlsProps {
  filters: {
    sort: SortType;
    interestFilter: InterestFilterType;
    finishedFilter: FinishedFilterType;
  };
  limit: number;
  interestsData: Interest[] | undefined;
  isInterestsLoading: boolean;
  handleSortChange: (newSort: SortType) => void;
  handleInterestFilterChange: (newInterest: InterestFilterType) => void;
  handleFinishedFilterChange: (checked: FinishedFilterType) => void;
  handleLimitChange: (newLimit: number) => void;
}

export const MeetingFilterControls = ({
  filters,
  limit,
  interestsData,
  isInterestsLoading,
  handleSortChange,
  handleInterestFilterChange,
  handleFinishedFilterChange,
  handleLimitChange,
}: MeetingFilterControlsProps) => {
  return (
    <div className="flex justify-between items-center px-4">
      <div className="flex items-center gap-2">
        {/* 카테고리 필터 */}
        <Select
          value={filters.interestFilter}
          onValueChange={handleInterestFilterChange}
        >
          <SelectTrigger className="w-[180px] bg-secondary text-primary-foreground">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            {isInterestsLoading ? (
              <p className="p-2 text-sm">로딩 중...</p>
            ) : (
              interestsData?.map((interest) => (
                <SelectItem key={interest.id} value={interest.id.toString()}>
                  {interest.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* 정렬 필터 */}
        <Select
          value={filters.sort}
          onValueChange={(value) => handleSortChange(value as SortType)}
        >
          <SelectTrigger className="w-[120px] bg-secondary text-primary-foreground">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 모집 여부 필터 */}
        <Button
          variant="outline"
          onClick={() => handleFinishedFilterChange(!filters.finishedFilter)}
        >
          {filters.finishedFilter ? "마감된 모임 포함" : "모집중인 모임"}
        </Button>

        {/* 개수 버튼 */}
        <Select
          value={limit.toString()}
          onValueChange={(value) => handleLimitChange(Number(value))}
        >
          <SelectTrigger className="w-[110px] bg-secondary text-primary-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩</SelectItem>
            <SelectItem value="20">20개씩</SelectItem>
            <SelectItem value="50">50개씩</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
