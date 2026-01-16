import { Button } from "@/components/ui/button";
import { useState } from "react";
import SmallMeetingCard from "@/components/features/mypage/SmallMeetingCard";
import { useMeQuery } from "@/hooks/useMeQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Pencil } from "lucide-react";
import CreateMeetingModal from "@/components/features/meetings/CreateMeetingModal";
import type { MyMeetingsResponse } from "@/api/me.api";

const HostMeeting = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<MyMeetingsResponse | null>(null);
    const [page, setPage] = useState(1);
    const { meetings: hostedMeetings, totalPages, isLoading } = useMeQuery('hosted', 'all', page, 5);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="w-full h-full p-10 bg-white overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">내 모임</h1>

            {/* 내가 만든 모임 */}
            <div className="space-y-4 mb-10">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {hostedMeetings?.map((meeting) => (
                            <SmallMeetingCard key={meeting.meetingId} meeting={meeting}>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-yellow-400 text-gray-900 shadow-none">멤버 관리</Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedMeeting(meeting);
                                            setIsModalOpen(true);
                                        }}
                                        className="border-yellow-400 text-gray-900 shadow-none"
                                    >
                                        <Pencil className="w-4 h-4 text-yellow-500" />
                                        수정
                                    </Button>
                                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-none shadow-none">채팅</Button>
                                </div>
                            </SmallMeetingCard>
                        ))}
                        {/* Empty State */}
                        {(!hostedMeetings || hostedMeetings.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">아직 만든 모임이 없어요 :&lt;</h3>
                                <Link to="/moimer-intro" className="text-gray-900 font-bold flex items-center hover:underline">
                                    첫번째 모임을 만들어볼까요? &gt;
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 모임 수정 모달 */}
            <CreateMeetingModal
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) setSelectedMeeting(null);
                }}
                meeting={selectedMeeting || undefined} // Pass selected meeting for editing
            />

            {totalPages > 0 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page > 1) handlePageChange(page - 1); }}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === pageNum}
                                    onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page < totalPages) handlePageChange(page + 1); }}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

export default HostMeeting;