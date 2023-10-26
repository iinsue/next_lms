import { getChapter } from "@/actions/get-chapter";
import { VideoPlayer } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <VideoPlayer
          chapterId={params.chapterId}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
      </div>
    </>
  );
};

export default ChapterIdPage;
