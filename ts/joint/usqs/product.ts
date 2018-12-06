
export async function product(queue:number):Promise<{queue:number, data:any}> {
    if (queue > 10) return;
    return {
        queue: ++queue,
        data: {
            queue: queue,
            content: 'from usq', 
        }
    }
}
