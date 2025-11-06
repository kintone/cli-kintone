import type { ParallelAssignmentValidator } from "@cucumber/cucumber/lib/support_code_library_builder/types";

/**
 * Our parallel can assign rules
 * ref. https://github.com/cucumber/cucumber-js/blob/db0956e0725e2ef00854c0d52c4392db00bdf307/docs/parallel.md
 * @param pickleInQuestion
 * @param picklesInProgress
 */
export const ourParallelCanAssignRules: ParallelAssignmentValidator = (
  pickleInQuestion,
  picklesInProgress,
) => {
  return serialResourceRule(pickleInQuestion, picklesInProgress);
};

/**
 * Serial resource rule
 * A pickle cannot run when another pickle with the same serial resource is running
 * Tag format: @serial(resource)
 * @param pickleInQuestion
 * @param picklesInProgress
 */
const serialResourceRule: ParallelAssignmentValidator = (
  pickleInQuestion,
  picklesInProgress,
) => {
  const serialResourcesInQuestion = pickleInQuestion.tags
    .map((tag) => extractSerialResourceFromTagName(tag.name))
    .filter((resource) => resource !== undefined);

  const serialResourcesInProgress = picklesInProgress
    .flatMap((pickle) =>
      pickle.tags.map((tag) => extractSerialResourceFromTagName(tag.name)),
    )
    .filter((resource) => resource !== undefined);

  const conflict = serialResourcesInQuestion.some((resource) =>
    serialResourcesInProgress.includes(resource),
  );

  // Debugging parallel execution
  // console.log("pickleInQuestion:", pickleInQuestion.name);
  // console.log(serialResourcesInQuestion, serialResourcesInProgress, conflict);

  // Deny execution when a resource conflict is found
  return !conflict;
};

const extractSerialResourceFromTagName = (tag: string) =>
  tag.match(/^@serial\((?<resource>[^)]+)\)$/)?.groups?.resource;
