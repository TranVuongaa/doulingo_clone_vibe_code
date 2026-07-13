<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Expo (React Native) language-learning app. The SDK is installed, a PostHog client is configured via `expo-constants` extras, `PostHogProvider` wraps the app root with autocapture (touches) and manual screen tracking, and seven custom events are captured across authentication, onboarding, language selection, and lesson engagement flows. Users are identified by email on sign-up and sign-in so sessions are tied to real persons.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully completes email sign-up and verifies their email code. | `components/auth-screen.tsx` |
| `user_signed_in` | Fired when a user successfully verifies their email code and signs in. | `components/auth-screen.tsx` |
| `social_auth_completed` | Fired when a user successfully authenticates using a social OAuth provider (Google, Facebook, Apple). | `components/auth-screen.tsx` |
| `onboarding_get_started_pressed` | Fired when a new visitor taps Get Started on the onboarding screen — top of the signup funnel. | `app/onboarding.tsx` |
| `language_selected` | Fired when a user confirms their chosen learning language. | `app/language.tsx` |
| `lesson_continued` | Fired when a user taps Continue to resume their current lesson from the home screen. | `app/(tabs)/index.tsx` |
| `ai_video_call_started` | Fired when a user taps the start button to begin an AI video call practice session. | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/509970/dashboard/1839311)
- [Onboarding to signup funnel (wizard)](https://us.posthog.com/project/509970/insights/YTk1uYNn)
- [Sign-ups and sign-ins over time (wizard)](https://us.posthog.com/project/509970/insights/PpER2dr7)
- [Language selections by language (wizard)](https://us.posthog.com/project/509970/insights/7Z13rMht)
- [Lesson engagement over time (wizard)](https://us.posthog.com/project/509970/insights/lmHmnj3J)
- [Social auth completions by provider (wizard)](https://us.posthog.com/project/509970/insights/q9HRJyYR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (Currently `identify` fires on email verification success; consider also calling it after Clerk session restore in `app/_layout.tsx`.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
