import { useMemo, useState } from "react";
import type {
  FinishedFilterType,
  InterestFilterType,
  SortType,
} from "@/api/meeting.api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Interest } from "@/models/interest.model";
import React from "react";
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  const selectedInterestName = useMemo(() => {
    if (filters.interestFilter === "ALL") return "카테고리";
    const found = interestsData?.find(
      (i) => i.id.toString() === filters.interestFilter
    );
    return found ? found.name : "카테고리";
  }, [filters.interestFilter, interestsData]);

  const selectedSortLabel = useMemo(() => {
    return (
      sortOptions.find((option) => option.value === filters.sort)?.label ||
      "정렬"
    );
  }, [filters.sort]);

  return (
    <div className="flex justify-between items-center px-4">
      <div className="flex items-center gap-2">
        {/* 카테고리 필터 */}
        <DropdownMenu
          open={isCategoryDropdownOpen}
          onOpenChange={setIsCategoryDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {selectedInterestName}
              {isCategoryDropdownOpen ? " ∧" : " ∨"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>관심사</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.interestFilter}
              onValueChange={handleInterestFilterChange}
            >
              <DropdownMenuRadioItem value="ALL">전체</DropdownMenuRadioItem>
              {isInterestsLoading ? (
                <DropdownMenuLabel>로딩 중...</DropdownMenuLabel>
              ) : (
                interestsData?.map((interest) => (
                  <DropdownMenuRadioItem
                    key={interest.id}
                    value={interest.id.toString()}
                  >
                    {interest.name}
                  </DropdownMenuRadioItem>
                ))
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 정렬 필터 */}
        <DropdownMenu
          open={isSortDropdownOpen}
          onOpenChange={setIsSortDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {selectedSortLabel}
              {isSortDropdownOpen ? " ∧" : " ∨"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>정렬</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={(value) => handleSortChange(value as SortType)}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 모집 여부 필터 */}
        <Button
          variant="outline"
          onClick={() => handleFinishedFilterChange(!filters.finishedFilter)}
        >
          {filters.finishedFilter ? "마감된 모임 포함" : "모집중인 모임"}
        </Button>

        {/* 개수 버튼 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{`${limit}개씩 보기`}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={limit.toString()}
              onValueChange={(value) => handleLimitChange(Number(value))}
            >
              <DropdownMenuRadioItem value="10">10개</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="20">20개</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="50">50개</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {sortOptions.map((option, index) => (
          <React.Fragment key={option.value}>
            <p
              className={`cursor-pointer ${
                filters.sort === option.value ? "" : "text-muted-foreground"
              }`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </p>
            {index < sortOptions.length - 1 && (
              <p className="text-muted-foreground">|</p>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
