import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Song } from '../../types';

const LivenessGraph: React.FC<{ songs: Song[] }> = ({ songs }) => {
    const d3Container = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (songs && d3Container.current) {
            const margin = { top: 20, right: 30, bottom: 60, left: 60 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            // Parse dates and sort songs by playedAt
            songs.forEach(song => {
                song.playedAt = new Date(song.playedAt);
            });
            songs.sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime());

            const x = d3.scaleTime()
                .domain(d3.extent(songs, d => d.playedAt) as [Date, Date])
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, 1])
                .range([height, 0]);

            // Clear previous SVG
            d3.select(d3Container.current).selectAll("*").remove();

            const svg = d3.select(d3Container.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Add the x-axis and title
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("y", 50)
                .attr("x", width / 2)
                .attr("text-anchor", "bold")
                .attr("stroke", "white")
                .attr("font-size", "16px")
                .text("Time");

            // Add the y-axis and title
            svg.append('g')
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -40)
                .attr("x", -height / 2)
                .attr("text-anchor", "bold")
                .attr("stroke", "white")
                .attr("font-size", "16px")
                .text("Liveness Score");

            // Add the points
            svg.selectAll('.dot')
                .data(songs)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => x(d.playedAt))
                .attr('cy', d => y(d.liveness))
                .attr('r', 5)
                .attr('fill', 'yellow');

            // Add invisible circles for larger hitbox
            svg.selectAll('.hitbox')
                .data(songs)
                .enter()
                .append('circle')
                .attr('class', 'hitbox')
                .attr('cx', d => x(d.playedAt))
                .attr('cy', d => y(d.liveness))
                .attr('r', 10) // Larger radius for the hitbox
                .attr('fill', 'transparent') // Make the hitbox circles invisible
                .on('mouseover', (event, d) => {
                    const tooltip = tooltipRef.current;
                    if (tooltip) {
                        tooltip.style.opacity = '0.9';
                        tooltip.style.left = `${event.pageX}px`;
                        tooltip.style.top = `${event.pageY}px`;
                        tooltip.innerHTML = 
                            `<strong>Song:</strong> ${d.name}<br>` +
                            `<strong>Artist:</strong> ${d.artist}<br>` +
                            `<strong>Played At:</strong> ${d3.timeFormat("%B %d, %Y %H:%M")(d.playedAt)}<br>` +
                            `<strong>Liveness Score:</strong> ${d.liveness}`;
                        tooltip.style.backgroundImage = `url(${d.trackImageUrl})`;
                        tooltip.style.backgroundSize = '100% 100%';
                        tooltip.style.backgroundRepeat = 'no-repeat';
                    }
                })
                .on('mouseout', () => {
                    const tooltip = tooltipRef.current;
                    if (tooltip) {
                        tooltip.style.opacity = '0';
                        tooltip.style.backgroundImage = '';
                    }
                });
        }
    }, [songs]);

    return (
        <div className="w-full relative">
            <svg ref={d3Container} className="mx-auto" width="100%" preserveAspectRatio="xMidYMid meet" />
            {/* Tooltip */}
            <div
                ref={tooltipRef}
                id="tooltip"
                className="tooltip bg-white border border-gray-300 shadow-md p-2 rounded-lg absolute transform -translate-x-1/2 -translate-y-1/2 opacity-0"
                style={{
                    transition: 'opacity 0.3s',
                    pointerEvents: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'black',
                    textShadow: '0px 0px 3px #fff',
                    padding: '10px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                }}
            ></div>
        </div>
    );
};

export default LivenessGraph;
