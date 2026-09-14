import { Book, FileText, Video, Code, Download, ExternalLink, GraduationCap, BookOpen } from 'lucide-react'

export const resources = {
    learning: [
      {
        title: "AWS Fundamentals Course",
        description: "Learn the basics of AWS services and cloud computing",
        icon: Book,
        link: "https://aws.amazon.com/getting-started/cloud-essentials/?nc2=h_ql_le_gs_awsf"
      },
      {
        title: "Cloud Practitioner Pathway",
        description: "Prepare for AWS Cloud Practitioner certification",
        icon: GraduationCap,
        link: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
      },
      {
        title: "Technical Documentation",
        description: "Access AWS service documentation and guides",
        icon: FileText,
        link: "https://docs.aws.amazon.com/"
      },
      {
        title: "Video Tutorials",
        description: "Watch step by step AWS service tutorials",
        icon: Video,
        link: "https://www.youtube.com/channel/UCd6MoB9NC6uYN2grvUNT-Zg"
      }
    ],
    tools: [
      {
        title: "AWS CLI Guide",
        description: "Learn to use the AWS Command Line Interface",
        icon: Code,
        link: "#"
      },
      {
        title: "SDK Examples",
        description: "Sample code for various AWS services",
        icon: Download,
        link: "#"
      },
      {
        title: "AWS Workshop Portal",
        description: "Interactive workshops and labs",
        icon: ExternalLink,
        link: "#"
      },
      {
        title: "Study Materials",
        description: "Certification study guides and practice exams",
        icon: BookOpen,
        link: "#"
      }
    ]
  }