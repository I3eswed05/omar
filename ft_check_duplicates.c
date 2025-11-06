/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_check_duplicates.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ialausud <ialausud@student.42amman.com>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 16:37:29 by ialausud          #+#    #+#             */
/*   Updated: 2025/11/06 16:42:47 by ialausud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

int ft_check_duplicates(t_list *stack, int value)
{
    t_list *tmp;

    tmp = stack;
    while (tmp->next)
    {
        if (tmp->value == value)
            return (0);
        tmp = tmp->next;
    }
    return (1);
}