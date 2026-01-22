import { ref, watch, onMounted, onBeforeUnmount } from "vue"

export function useProjectTasks(context, groupingIdRef) {
    const tasks = ref([])
    const error = ref(null)
    const loading = ref(false)
    const hasMore = ref(true)

    const limit = 2
    const offset = ref(0)
    const sentinel = ref(null)

    let observer = null

    let url = null

    if (context === "projectKanban") {
        url = `/api/projects/${groupingIdRef.value}/tasks?limit=${limit}&offset=${offset.value}&sortBy=assignee_id`
    } else if (context === "userKanban") {
        url = `/api/users/${groupingIdRef.value}/tasks?limit=${limit}&offset=${offset.value}&sortBy=project_id`
    }

    const loadTasks = async () => {
        if (loading.value || !hasMore.value || !groupingIdRef.value) return

        loading.value = true
        try {
            const res = await fetch(url)
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
        groupingIdRef,
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
