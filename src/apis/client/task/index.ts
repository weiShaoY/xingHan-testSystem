import request from '@/apis/http'

/**
 *  获取客户端 任务列表
 */
 export function fetchClientTaskList() {
  return request.post<ClientApi.Task.TaskListResponse>({
    url: '/client/learningtask/list',
  })
}
