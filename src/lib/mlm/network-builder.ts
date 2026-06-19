import { createClient } from '../supabase/server'

export async function findNextAvailablePosition(sponsorId: string): Promise<{ parentId: string, path: string }> {
  const supabase = createClient()
  
  // Breadth-First Search to find the first node with < 3 children (Ternary Unilevel)
  const queue = [{ id: sponsorId, level: 1 }]
  
  while (queue.length > 0) {
    const current = queue.shift()!
    
    // Safety check for depth limit
    if (current.level > 100) throw new Error("Tree too deep")

    // Find children of current node
    const { data: children } = await supabase
      .from('mlm_network')
      .select('user_id, position_path')
      .eq('parent_id', current.id)
      .order('created_at', { ascending: true })

    if (!children || children.length < 3) {
      // Found a spot!
      // We need to get the parent's path to build the new path
      const { data: parentNode } = await supabase
        .from('mlm_network')
        .select('position_path, level_in_network')
        .eq('user_id', current.id)
        .single()
        
      const parentPath = parentNode?.position_path || ''
      const newPath = parentPath ? `${parentPath}/${current.id}` : current.id
      
      return {
        parentId: current.id,
        path: newPath
      }
    }

    // Add children to queue
    for (const child of children) {
      queue.push({ id: child.user_id, level: current.level + 1 })
    }
  }

  throw new Error("Could not find available position")
}

export async function updateUplineCounts(newUserId: string, path: string) {
  const supabase = createClient()
  
  const uplineIds = path.split('/').filter(id => id !== '')
  
  // Increment total_downline for all uplines
  for (const uplineId of uplineIds) {
    const { data: node } = await supabase
      .from('mlm_network')
      .select('total_downline')
      .eq('user_id', uplineId)
      .single()
      
    if (node) {
      await supabase
        .from('mlm_network')
        .update({ total_downline: node.total_downline + 1 })
        .eq('user_id', uplineId)
    }
  }
}
