-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createtByCompanyId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "showResult" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyOptions" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "SurveyOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponses" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "surveyOptionsId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SurveyResponses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyOptions" ADD CONSTRAINT "SurveyOptions_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponses" ADD CONSTRAINT "SurveyResponses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponses" ADD CONSTRAINT "SurveyResponses_surveyOptionsId_fkey" FOREIGN KEY ("surveyOptionsId") REFERENCES "SurveyOptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponses" ADD CONSTRAINT "SurveyResponses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
