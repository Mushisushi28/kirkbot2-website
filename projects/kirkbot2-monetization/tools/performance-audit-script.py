#!/usr/bin/env python3
"""
KirkBot2 Performance Audit Tool
Automated system performance analysis and optimization recommendations
"""

import psutil
import time
import json
import os
import subprocess
from datetime import datetime
from typing import Dict, List, Tuple

class PerformanceAuditor:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'system_info': {},
            'performance_metrics': {},
            'recommendations': [],
            'optimizations': []
        }
    
    def get_system_info(self) -> Dict:
        """Collect basic system information"""
        return {
            'cpu_count': psutil.cpu_count(),
            'memory_total': psutil.virtual_memory().total // (1024**3),  # GB
            'disk_usage': {
                'total': psutil.disk_usage('/').total // (1024**3),  # GB
                'used': psutil.disk_usage('/').used // (1024**3),    # GB
                'percent': psutil.disk_usage('/').percent
            },
            'network_connections': len(psutil.net_connections()),
            'running_processes': len(psutil.pids())
        }
    
    def measure_cpu_performance(self) -> Dict:
        """Measure CPU performance and utilization"""
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_freq = psutil.cpu_freq()
        
        return {
            'cpu_utilization': cpu_percent,
            'cpu_frequency': cpu_freq.current if cpu_freq else None,
            'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None,
            'performance_score': self._calculate_cpu_score(cpu_percent)
        }
    
    def measure_memory_performance(self) -> Dict:
        """Measure memory usage and efficiency"""
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        return {
            'memory_used_percent': memory.percent,
            'memory_available': memory.available // (1024**3),  # GB
            'swap_used_percent': swap.percent,
            'memory_efficiency': self._calculate_memory_score(memory.percent),
            'recommendations': self._get_memory_recommendations(memory, swap)
        }
    
    def measure_disk_performance(self) -> Dict:
        """Measure disk I/O performance"""
        # Test disk read/write speed
        test_file = '/tmp/perf_test.tmp'
        
        # Write test
        start_time = time.time()
        with open(test_file, 'wb') as f:
            f.write(b'0' * (1024 * 1024 * 10))  # 10MB test
        write_speed = 10 / (time.time() - start_time)  # MB/s
        
        # Read test
        start_time = time.time()
        with open(test_file, 'rb') as f:
            f.read()
        read_speed = 10 / (time.time() - start_time)  # MB/s
        
        # Cleanup
        os.remove(test_file)
        
        disk_usage = psutil.disk_usage('/')
        
        return {
            'write_speed_mbps': round(write_speed, 2),
            'read_speed_mbps': round(read_speed, 2),
            'disk_usage_percent': disk_usage.percent,
            'disk_performance_score': self._calculate_disk_score(write_speed, read_speed)
        }
    
    def measure_network_performance(self) -> Dict:
        """Measure network performance and connectivity"""
        try:
            # Test latency to Google DNS
            ping_result = subprocess.run(
                ['ping', '-c', '1', '8.8.8.8'],
                capture_output=True, text=True, timeout=5
            )
            
            latency = None
            if ping_result.returncode == 0:
                # Extract latency from ping output
                for line in ping_result.stdout.split('\n'):
                    if 'time=' in line:
                        latency = float(line.split('time=')[1].split(' ')[0])
                        break
            
            net_io = psutil.net_io_counters()
            
            return {
                'latency_ms': latency,
                'bytes_sent': net_io.bytes_sent,
                'bytes_recv': net_io.bytes_recv,
                'network_score': self._calculate_network_score(latency)
            }
        except Exception as e:
            return {'error': str(e), 'network_score': 0}
    
    def analyze_application_performance(self, app_port: int = None) -> Dict:
        """Analyze specific application performance"""
        results = {}
        
        if app_port:
            # Test application response time
            try:
                start_time = time.time()
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                result = sock.connect_ex(('localhost', app_port))
                sock.close()
                
                if result == 0:
                    response_time = (time.time() - start_time) * 1000
                    results = {
                        'app_accessible': True,
                        'response_time_ms': round(response_time, 2),
                        'app_score': self._calculate_app_score(response_time)
                    }
                else:
                    results = {'app_accessible': False, 'app_score': 0}
            except Exception as e:
                results = {'error': str(e), 'app_score': 0}
        
        return results
    
    def generate_recommendations(self) -> List[Dict]:
        """Generate optimization recommendations based on analysis"""
        recommendations = []
        
        cpu_metrics = self.results['performance_metrics'].get('cpu', {})
        memory_metrics = self.results['performance_metrics'].get('memory', {})
        disk_metrics = self.results['performance_metrics'].get('disk', {})
        network_metrics = self.results['performance_metrics'].get('network', {})
        
        # CPU recommendations
        if cpu_metrics.get('cpu_utilization', 0) > 80:
            recommendations.append({
                'category': 'CPU',
                'priority': 'High',
                'issue': f"High CPU utilization: {cpu_metrics['cpu_utilization']}%",
                'recommendation': 'Consider process optimization or CPU scaling',
                'potential_improvement': '30-50% reduction in CPU usage'
            })
        
        # Memory recommendations
        if memory_metrics.get('memory_used_percent', 0) > 85:
            recommendations.append({
                'category': 'Memory',
                'priority': 'High',
                'issue': f"High memory usage: {memory_metrics['memory_used_percent']}%",
                'recommendation': 'Add memory or optimize memory-intensive processes',
                'potential_improvement': '40-60% memory efficiency gain'
            })
        
        # Disk recommendations
        if disk_metrics.get('disk_usage_percent', 0) > 90:
            recommendations.append({
                'category': 'Disk',
                'priority': 'Critical',
                'issue': f"High disk usage: {disk_metrics['disk_usage_percent']}%",
                'recommendation': 'Clean up disk space or add storage',
                'potential_improvement': 'Avoid system crashes'
            })
        
        # Network recommendations
        latency = network_metrics.get('latency_ms')
        if latency and latency > 100:
            recommendations.append({
                'category': 'Network',
                'priority': 'Medium',
                'issue': f"High network latency: {latency}ms",
                'recommendation': 'Optimize network configuration or check connectivity',
                'potential_improvement': '20-40% speed improvement'
            })
        
        return recommendations
    
    def run_full_audit(self) -> Dict:
        """Run complete performance audit"""
        print("🔍 Starting Performance Audit...")
        
        # Collect system information
        self.results['system_info'] = self.get_system_info()
        
        # Measure performance metrics
        self.results['performance_metrics']['cpu'] = self.measure_cpu_performance()
        self.results['performance_metrics']['memory'] = self.measure_memory_performance()
        self.results['performance_metrics']['disk'] = self.measure_disk_performance()
        self.results['performance_metrics']['network'] = self.measure_network_performance()
        
        # Generate recommendations
        self.results['recommendations'] = self.generate_recommendations()
        
        # Calculate overall performance score
        self.results['overall_score'] = self._calculate_overall_score()
        
        print("✅ Performance Audit Complete!")
        return self.results
    
    def generate_report(self, output_file: str = None) -> str:
        """Generate detailed performance report"""
        report = []
        report.append("# KirkBot2 Performance Audit Report")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # Overall Score
        overall_score = self.results.get('overall_score', 0)
        report.append(f"## Overall Performance Score: {overall_score}/100")
        report.append(f"**Status:** {self._get_performance_status(overall_score)}")
        report.append("")
        
        # System Information
        report.append("## System Information")
        info = self.results['system_info']
        report.append(f"- CPU Cores: {info['cpu_count']}")
        report.append(f"- Memory: {info['memory_total']}GB")
        report.append(f"- Disk Usage: {info['disk_usage']['percent']}%")
        report.append(f"- Running Processes: {info['running_processes']}")
        report.append("")
        
        # Performance Metrics
        metrics = self.results['performance_metrics']
        
        report.append("## Performance Metrics")
        report.append(f"### CPU Utilization: {metrics.get('cpu', {}).get('cpu_utilization', 0):.1f}%")
        report.append(f"### Memory Usage: {metrics.get('memory', {}).get('memory_used_percent', 0):.1f}%")
        report.append(f"### Disk Write Speed: {metrics.get('disk', {}).get('write_speed_mbps', 0):.1f} MB/s")
        report.append(f"### Disk Read Speed: {metrics.get('disk', {}).get('read_speed_mbps', 0):.1f} MB/s")
        report.append(f"### Network Latency: {metrics.get('network', {}).get('latency_ms', 'N/A')} ms")
        report.append("")
        
        # Recommendations
        report.append("## Optimization Recommendations")
        for i, rec in enumerate(self.results['recommendations'], 1):
            report.append(f"{i}. **{rec['category']} - {rec['priority']} Priority**")
            report.append(f"   - Issue: {rec['issue']}")
            report.append(f"   - Recommendation: {rec['recommendation']}")
            report.append(f"   - Potential Improvement: {rec['potential_improvement']}")
            report.append("")
        
        if output_file:
            with open(output_file, 'w') as f:
                f.write('\n'.join(report))
            print(f"📄 Report saved to: {output_file}")
        
        return '\n'.join(report)
    
    # Helper methods
    def _calculate_cpu_score(self, utilization: float) -> int:
        if utilization < 50: return 100
        elif utilization < 70: return 80
        elif utilization < 85: return 60
        else: return 40
    
    def _calculate_memory_score(self, usage_percent: float) -> int:
        if usage_percent < 60: return 100
        elif usage_percent < 75: return 80
        elif usage_percent < 85: return 60
        else: return 40
    
    def _calculate_disk_score(self, write_speed: float, read_speed: float) -> int:
        avg_speed = (write_speed + read_speed) / 2
        if avg_speed > 100: return 100
        elif avg_speed > 50: return 80
        elif avg_speed > 25: return 60
        else: return 40
    
    def _calculate_network_score(self, latency: float) -> int:
        if not latency: return 50
        if latency < 20: return 100
        elif latency < 50: return 80
        elif latency < 100: return 60
        else: return 40
    
    def _calculate_app_score(self, response_time: float) -> int:
        if response_time < 100: return 100
        elif response_time < 300: return 80
        elif response_time < 1000: return 60
        else: return 40
    
    def _calculate_overall_score(self) -> int:
        metrics = self.results['performance_metrics']
        scores = []
        
        if 'cpu' in metrics:
            scores.append(metrics['cpu'].get('performance_score', 0))
        if 'memory' in metrics:
            scores.append(metrics['memory'].get('memory_efficiency', 0))
        if 'disk' in metrics:
            scores.append(metrics['disk'].get('disk_performance_score', 0))
        if 'network' in metrics:
            scores.append(metrics['network'].get('network_score', 0))
        
        return sum(scores) // len(scores) if scores else 0
    
    def _get_performance_status(self, score: int) -> str:
        if score >= 80: return "🟢 Excellent"
        elif score >= 60: return "🟡 Good"
        elif score >= 40: return "🟠 Fair"
        else: return "🔴 Needs Attention"
    
    def _get_memory_recommendations(self, memory, swap) -> List[str]:
        recommendations = []
        if memory.percent > 85:
            recommendations.append("Consider adding more RAM")
        if swap.percent > 50:
            recommendations.append("Optimize swap usage")
        return recommendations

def main():
    """Main execution function"""
    auditor = PerformanceAuditor()
    
    # Run full audit
    results = auditor.run_full_audit()
    
    # Generate and save report
    report_path = f"/tmp/performance_audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    report = auditor.generate_report(report_path)
    
    # Print summary
    print("\n" + "="*50)
    print("🚀 KIRKBOT2 PERFORMANCE AUDIT SUMMARY")
    print("="*50)
    print(f"Overall Score: {results['overall_score']}/100")
    print(f"Status: {auditor._get_performance_status(results['overall_score'])}")
    print(f"Recommendations: {len(results['recommendations'])}")
    print(f"Report: {report_path}")
    print("="*50)
    
    return results

if __name__ == "__main__":
    import socket  # Import here for network testing
    main()