import request from '@/apis/http'

/**
 *  获取客户端 任务列表
 */
export function fetchClientTaskList(params: ClientApi.Task.TaskListParams) {
  return request.post<ClientApi.Task.TaskListResponse>({
    url: '/client/learningtask/list',
    authPath: '/client',
    data: params,
  })
}
