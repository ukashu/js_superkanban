import { ref, watch, onMounted, onBeforeUnmount } from "vue"

export function useProjectTasks(projectIdRef) {
    const tasks = ref([])
    const error = ref(null)
    const loading = ref(false)
    const hasMore = ref(true)

    const limit = 10
    const offset = ref(0)
    const sentinel = ref(null)

    let observer = null

    const loadTasks = async () => {
        if (loading.value || !hasMore.value || !projectIdRef.value) return

        loading.value = true
        try {
            const res = await fetch(
                `/api/projects/${projectIdRef.value}/tasks?limit=${limit}&offset=${offset.value}&sortBy=assignee_id`,
            )
            if (!res.ok) {
                throw new Error("Failed to fetch tasks")
            }

            const json = await res.json()
            tasks.value.push(...json.data.tasks)
            hasMore.value = json.data.hasMore
            offset.value += limit
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    watch(
        projectIdRef,
        () => {
            tasks.value = []
            offset.value = 0
            hasMore.value = true
            error.value = null
            loadTasks()
        },
        { immediate: true },
    )

    onMounted(() => {
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadTasks()
                }
            },
            {
                root: null,
                threshold: 0.1,
            },
        )

        if (sentinel.value) observer.observe(sentinel.value)
    })
    onBeforeUnmount(() => {
        if (observer && sentinel.value) {
            observer.unobserve(sentinel.value)
        }
    })

    return { tasks, loading, error, hasMore, sentinel, loadTasks }
}
