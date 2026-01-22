import { ref, watch } from "vue"

export function useDragTask(tasksRef) {
    const draggedTask = ref(null)

    const changeTaskStatus = async (e, newStatus) => {
        if (newStatus != draggedTask.value.status) {
            updateTaskStatusLocal(draggedTask.value.id, newStatus)
            try {
                const res = await fetch(
                    `/api/projects/${draggedTask.value.projectId}/tasks/${draggedTask.value.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                    },
                )
                if (!res.ok) {
                    throw new Error("Failed to update task status")
                }
                const json = await res.json()
                console.log(json)
            } catch (err) {
                error.value = err.message
            }
        }
        draggedTask.value = null
    }

    const changeNonDragTaskStatus = async (task, newStatus) => {
        updateTaskStatusLocal(task.task_id, newStatus)
        try {
            const res = await fetch(
                `/api/projects/${task.project_id}/tasks/${task.task_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                },
            )
            if (!res.ok) {
                throw new Error("Failed to update task status")
            }
            const json = await res.json()
            console.log(json)
        } catch (err) {
            error.value = err.message
        }
    }

    const updateTaskStatusLocal = (taskId, newStatus) => {
        const task = tasksRef.value.find((t) => t.task_id === taskId)
        if (!task) return
        task.status = newStatus
    }

    const dragStart = (event, task) => {
        event.dataTransfer.dropEffect = "move"
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", task.task_id.toString())
        //emit("drag-task", task.task_id)

        draggedTask.value = {
            id: task.task_id,
            status: task.status,
            projectId: task.project_id,
        }
    }
    const dragEnd = () => {
        draggedTask.value = null
    }

    return {
        draggedTask,
        changeTaskStatus,
        changeNonDragTaskStatus,
        dragStart,
        dragEnd,
    }
}
